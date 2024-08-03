---
layout: post
title: hello world!
---

![martian](/assets/image.png){:width="500px"}

hello earthlings, i'm martian. this is my first post on this site.

### Testing code blocks

```python
torch.manual_seed(42)

# An epoch is one loop through the data
epochs = 200

# Tracking different values
epoch_count = []
loss_values = []
test_loss_values = []

# 0. Loop through the data
for epoch in range(epochs):
  # set the model to training mode
  model_0.train()

  # 1. Forward pass
  y_pred = model_0(X_train)

  # 2. Calculate the loss
  loss = loss_fn(y_pred, y_train)

  # 3. Optimizer zero grad
  optimizer.zero_grad()

  # 4. Loss backward/ perform backpropagation
  loss.backward()

  # 5. Step the optimizer (perform gradient descent)
  optimizer.step()

  ### set the model to testing mode - turn off different settings not needed for evaluation/testing (dropout/batchnorm)
  model_0.eval()
  with torch.inference_mode(): # turns off gradient tracking
    # 1. Do the forward pass
    test_pred = model_0(X_test)

    # 2. Calculate the loss
    test_loss = loss_fn(test_pred, y_test )

  if epoch%10 == 0:
    epoch_count.append(epoch)
    loss_values.append(loss)
    test_loss_values.append(test_loss)
    print(f"Epoch: {epoch} | Loss: {loss} | Test loss: {test_loss}")
    print(model_0.state_dict())
```

## Testing LaTeX

$$ \text{softmax}(x_i) = \frac{e^{x_i}}{\sum_{j=1}^{n} e^{x_j}}$$

**Bold**

*Italics*

- Unordered
- Item

1. Order
2. Item

# Heading 1

## Heading 2

### Heading 3






> Quote
> hey

## Table


| 1   | 2     |
| --- | ----- |
| hey | hello |

Ruler

---


